import json
import re
import subprocess
import sys
from logging import Logger, basicConfig, getLogger
from pathlib import Path


def main():
    basicConfig()
    logger = getLogger(__name__)

    try:
        new_version = sys.argv[1]
    except IndexError:
        logger.error("version is not passed as an argument")
        sys.exit(1)

    if not (text_is_valid_semver(new_version)):
        logger.error(f"specified string is not a valid SemVer: {new_version}")
        sys.exit(2)

    def change_version_in_json(new_version: str, path: Path) -> None:
        obj = json.loads(Path(path).read_text(encoding="utf_8"))

        current_version = obj.get("version")
        current_nums = tuple(int(n) for n in current_version.split("."))
        new_nums = tuple(int(n) for n in new_version.split("."))
        if not len(current_nums) == len(new_nums) == 3:
            logger.error(f"unexpected version string: {current_version}")
            sys.exit(3)
        if new_nums <= current_nums:
            logger.warning(f"it is not upgrading: {current_version} -> {new_version}")

        obj["version"] = new_version
        path.write_text(json.dumps(obj, ensure_ascii=False, indent=2), encoding="utf_8")

    change_version_in_json(new_version, Path("manifest.json"))
    change_version_in_json(new_version, Path("package.json"))

    update_versions_json(logger)

    subprocess.run(["npm", "run", "format"])


def text_is_valid_semver(
    text: str,
    pat=re.compile(r"(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)"),
) -> bool:
    return pat.fullmatch(text) is not None


def update_versions_json(logger: Logger):
    manifest: dict[str, str] = json.loads(
        Path("manifest.json").read_text(encoding="utf_8")
    )

    try:
        minAppVersion = manifest["minAppVersion"]
    except KeyError:
        logger.error("minAppVersion is not specified in 'manifest.json'")
        return

    versions: dict[str, str] = json.loads(
        Path("versions.json").read_text(encoding="utf_8")
    )

    if minAppVersion not in versions.values():
        versions[manifest["version"]] = minAppVersion
        Path("versions.json").write_text(
            json.dumps(versions, ensure_ascii=False, indent=2),
            encoding="utf_8",
        )


if __name__ == "__main__":
    main()
