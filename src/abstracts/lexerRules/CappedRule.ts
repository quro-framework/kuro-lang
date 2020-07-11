import { ILexerRule, IWalker, ILoc } from '../../interfaces'
import { Token } from '../../types'
import { LocatedError } from '../../impls'

/*
 * Cap type.
 */
export type Cap = {
  /**
   * Start cap.
   */
  start: string

  /**
   * End cap.
   */
  end: string
}

/*
 * CappedRule class.
 */
export abstract class CappedRule<T extends Token> implements ILexerRule {
  /**
   * Caps.
   */
  readonly caps: Cap[] = []

  /**
   * CappedRule constructor.
   *
   * @param caps Caps.
   */
  constructor(caps: Cap[]) {
    this.caps = caps
  }

  validate(walker: IWalker<string>): boolean {
    return !!this.getCap(walker)
  }

  execute(walker: IWalker<string>): T {
    const cap = this.getCap(walker)
    const start = walker.index()
    const commentStart = start + cap.start.length

    walker.next(cap.start.length)

    while (!walker.match(cap.end)) {
      if (walker.done()) {
        throw this.createUnterminatedError(walker.locFrom(start))
      }
      walker.next()
    }

    walker.next(cap.end.length)

    const body = walker
      .slice(commentStart, walker.index() - cap.end.length)
      .join('')

    return this.createToken(body, walker.locFrom(start))
  }

  /**
   * If there's a corresponding cap in Walker, returns it.
   *
   * @param walker Walker.
   */
  protected getCap(walker: IWalker<string>): Cap {
    return this.caps.find((cap) => walker.match(cap.start))
  }

  /**
   * Returns a token by body string and returns it.
   *
   * @param body Body string.
   * @param loc Token location.
   */
  abstract createToken(body: string, loc: ILoc): T

  /**
   * Returns an unterminated error.
   *
   * @param loc Error location.
   */
  abstract createUnterminatedError(loc: ILoc): LocatedError
}