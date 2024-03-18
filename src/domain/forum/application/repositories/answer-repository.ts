import { PaginationParams } from '@/core/repositories/paginations-params'
import { Answer } from '../../enterprise/entities/answer'

export interface AnswerRepository {
  findById(id: string): Promise<Answer | null>
  create(answer: Answer): Promise<void>
  delete(answer: Answer):Promise<void>
  findManyByQuestionId(questionId: string, params: PaginationParams): Promise<Answer[]>
  save(answer: Answer):Promise<void>
}
