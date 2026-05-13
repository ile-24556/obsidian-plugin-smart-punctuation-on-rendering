import json
import re
import sys
from logging import basicConfig, getLogger
from pathlib import Path
from typing import Any


def main() -> None:
    basicConfig()
    logger = getLogger(__name__)

    try:
        tag = sys.argv[1]
    except IndexError:
        logger.error("tag is not passed as an argument")
        sys.exit(1)

    if not text_is_valid_semver(tag):
        logger.error("tag is not a valid SemVer.")
        sys.exit(2)
    if extract_version_from_json("package.json") != tag:
        logger.error("version value in 'package.json' differs from tag.")
        sys.exit(3)
    if extract_version_from_json("manifest.json") != tag:
        logger.error("version value in 'manifest.json' differs from tag.")
        sys.exit(4)

    logger.info("tag and version strings are valid")


def text_is_valid_semver(
    text: str,
    pat=re.compile(r"(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)"),
) -> bool:
    return pat.fullmatch(text) is not None


def extract_version_from_json(path: str, key="version") -> Any | None:
    o: dict[str, Any] = json.loads(Path(path).read_text(encoding="utf_8"))
    return o.get(key)


if __name__ == "__main__":
    main()
