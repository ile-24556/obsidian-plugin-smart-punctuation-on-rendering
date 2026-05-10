"""Parse smart_punct.txt taken from https://github.com/commonmark/commonmark.js"""

from dataclasses import dataclass
from enum import Enum
from pathlib import Path


class State(Enum):
    NORMAL = 1
    INPUT_IN_CODEBLOCK = 2
    OUTPUT_IN_CODEBLOCK = 3


@dataclass(frozen=True)
class Case:
    description: str
    input: str
    output: str


def main() -> None:
    path = Path("third_party/commonmark.js/smart_punct.txt")

    state = State.NORMAL
    description: list[str] = []
    input_s: list[str] = []
    output_s: list[str] = []
    cases: list[Case] = []

    for line in path.read_text(encoding="utf_8").splitlines():
        match state:
            case State.NORMAL:
                if not line or line.startswith("##"):
                    continue
                if line.startswith("```"):
                    state = State.INPUT_IN_CODEBLOCK
                    continue

                description.append(line)

            case State.INPUT_IN_CODEBLOCK:
                if line == ".":
                    state = State.OUTPUT_IN_CODEBLOCK
                    continue

                input_s.append(line)

            case State.OUTPUT_IN_CODEBLOCK:
                if line.startswith("```"):
                    state = State.NORMAL

                    _case = Case(
                        description=" ".join(description),
                        input=f"<p>{'\n'.join(input_s)}</p>",
                        output="\n".join(output_s),
                    )
                    print(_case.__dict__)
                    cases.append(_case)
                    description = []
                    input_s = []
                    output_s = []
                    continue

                output_s.append(line)


if __name__ == "__main__":
    main()
