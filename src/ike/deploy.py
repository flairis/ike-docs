import json
import keyring
import logging
import os
import pathspec
import requests
import time
import typer
import yaml
import zipfile

logger = logging.getLogger(__name__)


def _get_api_key():
    api_key = keyring.get_password('ike', 'api_key')

    if not api_key:
        api_key = typer.prompt("Enter API key", hide_input=True)
        keyring.set_password('ike', 'api_key', api_key)

    return api_key


def _get_build_path(node_root: str):
    return os.path.join(node_root, "build.zip")


def build_project(node_root: str):
    logger.info("Building project...")

    with open(".gitignore", "r") as file:
        ignore_spec = pathspec.PathSpec.from_lines("gitwildmatch", file)

    build_path = _get_build_path(node_root)

    with zipfile.ZipFile(build_path, "w", zipfile.ZIP_DEFLATED) as zipf:
        for root, _, files in os.walk(node_root):  
            for file in files:
                file_path = os.path.join(root, file)
                rel_path = os.path.relpath(file_path, node_root)
                
                if not ignore_spec.match_file(rel_path):
                    zipf.write(file_path, rel_path)


def deploy_project(node_root: str, project_name: str) -> str:
    logger.info("Queueing deployment...")

    build_path = _get_build_path(node_root)

    with open(build_path, "rb") as file:
        response = requests.post(f"https://yron03hrwk.execute-api.us-east-1.amazonaws.com/dev/projects/{project_name}", 
            headers={
                "x-api-key": _get_api_key(),
                "Content-Type": "application/zip"
            }, 
            data=file
        )

    # Clean up build artifact
    os.remove(build_path)

    if response.status_code == 202:
        body = response.json()
        _monitor_deployment(body["deploymentId"])
    else:
        logger.info(f"Deployment failed: {response.status_code} {response.text}")
        raise typer.Exit(1)


def _monitor_deployment(deployment_id: str):
    logger.info("Monitoring deployment...")

    url = f"https://yron03hrwk.execute-api.us-east-1.amazonaws.com/dev/deployments/{deployment_id}"
    headers = {
        "x-api-key": _get_api_key()
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
