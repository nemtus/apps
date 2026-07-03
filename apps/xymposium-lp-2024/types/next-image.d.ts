// next-env.d.ts は Next が自動生成し gitignore 対象のため、CI のクリーンな checkout +
// build 前の typecheck では存在せず、画像 import (.png/.webp 等) の型が解決できない。
// Next の画像モジュール宣言をこの tracked ファイルで参照し、typecheck を build 非依存にする。
/// <reference types="next/image-types/global" />
