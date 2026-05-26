import json
import re
import subprocess
import sys
from logging import Logger, basicConfig, getLogger
from pathlib import Path


class SemVer:
    major: int
    minor: int
    patch: int

    def __init__(self, version: str) -> None:
        if (
            re.fullmatch(r"(\d|[1-9]\d+)\.(\d|[1-9]\d+)\.(\d|[1-9]\d+)", version)
            is None
        ):
            raise ValueError(f"'{version}' is not a valid SemVer.")
        self.major, self.minor, self.patch = (int(n) for n in version.split("."))

    def __repr__(self) -> str:
        return f"{self.major}.{self.minor}.{self.patch}"

    def update_major(self) -> None:
        self.major += 1
        self.minor = self.patch = 0

    def update_minor(self) -> None:
        self.minor += 1
        self.patch = 0

    def update_patch(self) -> None:
        self.patch += 1


def main():
    basicConfig()
    logger = getLogger(__name__)

    try:
        option = sys.argv[1]
    except IndexError:
        logger.error("an argument is required: (--major|--minor|--patch)")
        sys.exit(1)

    try:
        sys.argv[2]
    except IndexError:
        pass
    else:
        logger.error(
            "exactly one argument must be specified: (--major|--minor|--patch)",
        )
        sys.exit(2)

    def change_version_in_json(path: Path, new_version: SemVer | None = None) -> SemVer:
        """Update version in the JSON file and
        return the `SemVer` object with the new version.
        """
        obj = json.loads(Path(path).read_text(encoding="utf_8"))

        if new_version is None:
            new_version = SemVer(obj.get("version"))
            match option:
                case "--major":
                    new_version.update_major()
                case "--minor":
                    new_version.update_minor()
                case "--patch":
                    new_version.update_patch()
                case _:
                    logger.error("an argument is required: (--major|--minor|--patch)")
                    sys.exit(3)

        obj["version"] = str(new_version)
        path.write_text(json.dumps(obj, ensure_ascii=False, indent=2), encoding="utf_8")
        return new_version

    new_version = change_version_in_json(Path("manifest.json"))
    change_version_in_json(Path("package.json"), new_version)

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
