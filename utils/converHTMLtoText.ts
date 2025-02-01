export function substituirCaracteresEspeciais(texto: string): string {
    const mapeamento: { [key: string]: string } = {
        "&#8220;": '"',
        "&#8221;": '"',
        "&#8216;": "'",
        "&#8217;": "'",
        "&#8211;": "–",
        "<p>":"",
        "</p>":"",
        "&hellip;": "..."
    };

    for (const charEspecial in mapeamento) {
        if (Object.prototype.hasOwnProperty.call(mapeamento, charEspecial)) {
            const charNormal = mapeamento[charEspecial];
            const regex = new RegExp(charEspecial, 'g');
            texto = texto.replace(regex, charNormal);
        }
    }

    return texto;
}
