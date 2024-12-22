import importlib
import json
import logging
import os
import shutil
import typer

from .bootstrap import download_starter_code
from .deploy import build_project, deploy_project
from .link import link_config_file, link_existing_pages, link_page_on_creation
from .node import get_node_root, install_node_modules, is_node_installed, run_node_dev
from .parser import prepare_references
from .utils import get_package_name, get_project_root

app = typer.Typer()
logger = logging.getLogger(__name__)


@app.command()
def init():
    if not is_node_installed():
        logger.error(
            "Ike depends on Node.js. Make sure it's installed in the current "
            "environment and available in the PATH."
        )
        raise typer.Exit(1)

    package_name = typer.prompt("What's the name of your package?")

    try:
        importlib.import_module(package_name)
    except ImportError:
        logger.error(
            f"Ike couldn't import a package named '{package_name}'. Make sure it's "
            "installed in the current environment."
        )
        raise typer.Exit(1)

    project_root = os.path.join(os.getcwd(), "docs/")
    download_starter_code(project_root)
    install_node_modules(project_root)
    link_config_file(project_root)
    link_existing_pages(project_root)


@app.command()
def dev():
    project_root = get_project_root()

    prepare_references(project_root)
    link_config_file(project_root)
    link_existing_pages(project_root)
    link_page_on_creation(project_root)
    run_node_dev(project_root)


@app.command()
def deploy():
    node_root = get_node_root(get_project_root())
    package_name = get_package_name()

    build_project(node_root)
    deploy_project(node_root, package_name)


def main():
    app()


if __name__ == "__main__":
    main()
