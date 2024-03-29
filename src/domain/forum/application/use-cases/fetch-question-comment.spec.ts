import { expect, it, beforeEach } from 'vitest'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { InMemoryQuestionCommentRepository } from 'test/repositories/in-memory-question-comment-repository'
import { FetchQuestionsCommentsUseCase } from './fetch-question-comment'
import { makeQuestionComment } from 'test/factories/make-question-comment'

let inMemoryQuestionCommentRepository: InMemoryQuestionCommentRepository
let sut: FetchQuestionsCommentsUseCase

describe('fetch question comment', () =>{

  beforeEach(() =>{
    inMemoryQuestionCommentRepository = new InMemoryQuestionCommentRepository()
    sut = new FetchQuestionsCommentsUseCase(inMemoryQuestionCommentRepository)

  })
  
  it('Should be able to fetch question comment', async () => {
      await inMemoryQuestionCommentRepository.create(makeQuestionComment({
        questionId: new UniqueEntityId('question-1')
      }))

      await inMemoryQuestionCommentRepository.create(makeQuestionComment({
        questionId: new UniqueEntityId('question-1')
      }))

      await inMemoryQuestionCommentRepository.create(makeQuestionComment({
        questionId: new UniqueEntityId('question-1')
      }))
    

      const result = await sut.execute({
        questionId: 'question-1',
        page: 1
      })


      expect(result.value?.questionComments).toHaveLength(3)
  })

  it('Should be able to fetch pagineted question comment ', async () => {

    for(let i = 1; i <= 22; i++){
        await inMemoryQuestionCommentRepository.create(makeQuestionComment({
            questionId: new UniqueEntityId('question-1')
          }))

    }

    const result = await sut.execute({
        questionId: 'question-1',
      page: 2
    })


    expect(result.value?.questionComments).toHaveLength(2)
})
})


