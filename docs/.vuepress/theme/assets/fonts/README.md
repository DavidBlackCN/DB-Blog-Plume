# Living Signature

`living-signature.woff2` is a WOFF2 subset of **Ma Shan Zheng**, used only for the LivingHero signature `有些事你不要太当真。《售梦者》`.

- Source: https://github.com/google/fonts/tree/main/ofl/mashanzheng
- Original file: `MaShanZheng-Regular.ttf`
- Original SHA-256: `6d2546bb189c732a8ca29af9e22457b152387d158aa459e4ac2ce1e51788b7fb`
- Copyright 2018 The Ma Shan Zheng Project Authors (https://github.com/googlefonts/mashanzheng)
- License: SIL Open Font License 1.1, included at `../../../public/fonts/living-signature/OFL.txt` and published at `/fonts/living-signature/OFL.txt`.
- Downloaded and subset on 2026-10-07 with fontTools, preserving all font name/license records. No runtime external font request or new npm dependency.

To regenerate after changing the signature, download the original TTF and use fontTools:

```sh
pyftsubset MaShanZheng-Regular.ttf --text="有些事你不要太当真。《售梦者》" --flavor=woff2 --name-IDs='*' --name-legacy --name-languages='*' --output-file=living-signature.woff2
```

The CSS uses a relative asset import, so Vite fingerprints the file and resolves the deployment base. Characters absent from the subset fall back to KaiTi / STKaiti / serif; regenerate the subset when editing the quote.
