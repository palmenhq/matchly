export class Matcher {
  constructor(public readonly name: string) {}
}

export const rest = new Matcher('rest')

export const anySingle = new Matcher('anySingle')

export const any: Matcher = new Matcher('any')
