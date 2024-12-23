import importlib
import json
import keyring
import logging
import os
import pathspec
import shutil
import zipfile
import time
import requests
import typer

from .bootstrap import download_starter_code
from .link import link_config_file, link_existing_pages, link_page_on_creation
from .node import install_node_modules, is_node_installed, run_node_dev
from .parser import prepare_references

app = typer.Typer()
logger = logging.getLogger(__name__)


@app.command()
def init():
    if not is_node_installed():
        logger.error(
            "Luma depends on Node.js. Make sure it's installed in the current "
            "environment and available in the PATH."
        )
        raise typer.Exit(1)

    package_name = typer.prompt("What's the name of your package?")

    try:
        importlib.import_module(package_name)
    except ImportError:
        logger.error(
            f"Luma couldn't import a package named '{package_name}'. Make sure it's "
            "installed in the current environment."
        )
        raise typer.Exit(1)

    project_root = os.path.join(os.getcwd(), "docs/")
    download_starter_code(project_root)
    install_node_modules(project_root)
    link_config_file(project_root)
    link_existing_pages(project_root)


def _get_node_root(project_root: str = None) -> str:
    if not project_root:
       project_root = _get_project_root()
       
    return os.path.join(project_root, ".luma")


def _get_project_root():
    project_root = os.getcwd() 

    if not os.path.exists(os.path.join(project_root, "luma.yaml")): 
        logger.error("The current directory isn't a valid Luma project.") 
        raise typer.Exit(1) 

    return project_root


@app.command()
def dev():
    project_root = _get_project_root()

    prepare_references(project_root)
    link_config_file(project_root)
    link_existing_pages(project_root)
    link_page_on_creation(project_root)
    run_node_dev(project_root)


@app.command()
def deploy():
    api_key = keyring.get_password('luma', 'api_key')

    if not api_key:
        api_key = typer.prompt("Enter API key", hide_input=True)
        keyring.set_password('luma', 'api_key', api_key)

    node_root = _get_node_root()
    build_path = os.path.join(node_root, "build.zip")
    _build_project(node_root, build_path)

    deployment_id = _queue_deployment(api_key, build_path)
    _monitor_deployment(api_key, deployment_id)

    
def _build_project(node_root: str, build_path: str):
    logger.info("Building project...")

    with open(".gitignore", "r") as file:
        ignore_spec = pathspec.PathSpec.from_lines("gitwildmatch", file)

    with zipfile.ZipFile(build_path, "w", zipfile.ZIP_DEFLATED) as zipf:
        for root, _, files in os.walk(node_root):  
            for file in files:
                file_path = os.path.join(root, file)
                rel_path = os.path.relpath(file_path, node_root)
                
                if not ignore_spec.match_file(rel_path):
                    zipf.write(file_path, rel_path)


def _queue_deployment(api_key: str, build_path: str) -> str:
    logger.info("Queueing deployment...")

    with open(build_path, "rb") as file:
        response = requests.post("https://yron03hrwk.execute-api.us-east-1.amazonaws.com/dev/docs/build", 
            headers={
                "x-api-key": api_key,
                "Content-Type": "application/zip"
            }, 
            data=file
        )

    # Clean up build artifact
    os.remove(build_path)

    if response.status_code == 202:
        body = json.loads(response.json()["body"])
        return body["deploymentId"]
    else:
        logger.info(f"Deployment failed: {response.status_code} {response.text}")
        raise typer.Exit(1)


def _monitor_deployment(api_key: str, deployment_id: str):
    logger.info("Monitoring deployment...")

    url = f"https://yron03hrwk.execute-api.us-east-1.amazonaws.com/dev/docs/build/{deployment_id}"
    headers = {
        "x-api-key": api_key
    }
    timeout = time.time() + (15 * 60)

    while time.time() < timeout:
        try:
            response = requests.get(url, headers=headers)
            body = response.json()
            status = body["status"]

            if status == "READY":
                logger.info(f"Deployment successful! {body["deploymentUrl"]}")
                return
            elif status == "ERROR":
                logger.info(f"Deployment failed: {body["error_message"]}")
                return

            time.sleep(10)
        except requests.exceptions.RequestException as e:
            logger.error(f"Error while checking deployment status: {e}")
            return

    logger.warn("Timed out while monitoring deployment.")


def main():
    app()


if __name__ == "__main__":
    main()
