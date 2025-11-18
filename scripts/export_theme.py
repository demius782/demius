"""Utility script to提取 themes/demius 目录用于单独发布.

示例:
    python scripts/export_theme.py --output dist/demius --zip
"""

from __future__ import annotations

import argparse
import shutil
import sys
from pathlib import Path


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="复制 themes/demius 到指定目录, 便于推送到独立仓库或打包发布。"
    )
    parser.add_argument(
        "--output",
        type=Path,
        default=Path("dist") / "demius-theme",
        help="复制后的输出目录 (默认: dist/demius-theme)",
    )
    parser.add_argument(
        "--zip",
        action="store_true",
        help="复制完成后额外生成 zip 压缩包 (与输出目录同名)",
    )
    return parser.parse_args()


def copy_theme(dest: Path) -> Path:
    repo_root = Path(__file__).resolve().parents[1]
    source = repo_root / "themes" / "demius"

    if not source.exists():
        raise FileNotFoundError(f"主题目录不存在: {source}")

    dest = dest.resolve()
    if dest.exists():
        shutil.rmtree(dest)
    dest.parent.mkdir(parents=True, exist_ok=True)

    shutil.copytree(
        source,
        dest,
        ignore=shutil.ignore_patterns(".git", ".github", ".DS_Store", "__pycache__"),
    )
    return dest


def maybe_zip(dest: Path) -> Path | None:
    archive_base = dest
    archive_path = shutil.make_archive(str(archive_base), "zip", root_dir=dest)
    return Path(archive_path)


def main() -> int:
    args = parse_args()
    dest = copy_theme(args.output)
    print(f"主题已复制到: {dest}")

    if args.zip:
        archive = maybe_zip(dest)
        print(f"ZIP 包已生成: {archive}")

    return 0


if __name__ == "__main__":
    raise SystemExit(main())

