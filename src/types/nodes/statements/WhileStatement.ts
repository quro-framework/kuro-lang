import { BlockStatement } from '../..'
import { Expression } from '../Expression'
import { StatementNodeBase } from '../../StatementNodeBase'

/**
 * WhileStatement type.
 */
export type WhileStatement = StatementNodeBase<'while_statement'> & {
  /**
   * Condition expression.
   */
  condition: Expression

  /**
   * Statement.
   */
  body: BlockStatement
}
