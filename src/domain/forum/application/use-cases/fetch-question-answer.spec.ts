import { expect, it, beforeEach } from 'vitest'
import { InMemoryAnswerRepository } from 'test/repositories/in-memory-answer-repository'
import { FetchQuestionsAnswersUseCase } from './fetch-question-answer'
import { makeAnswer } from 'test/factories/make-answer'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'

let inMemoryAnswerRepository: InMemoryAnswerRepository
let sut: FetchQuestionsAnswersUseCase

describe('fetch question answers', () =>{

  beforeEach(() =>{
    inMemoryAnswerRepository = new InMemoryAnswerRepository()
    sut = new FetchQuestionsAnswersUseCase(inMemoryAnswerRepository)

  })
  
  it('Should be able to fetch question answers', async () => {
      await inMemoryAnswerRepository.create(makeAnswer({
        questionId: new UniqueEntityId('question-1')
      }))
      await inMemoryAnswerRepository.create(makeAnswer({
        questionId: new UniqueEntityId('question-1')
      }))
      await inMemoryAnswerRepository.create(makeAnswer({
        questionId: new UniqueEntityId('question-1')
      }))

      const result = await sut.execute({
        questionId: 'question-1',
        page: 1
      })


      expect(result.value?.answers).toHaveLength(3)
  })

  it('Should be able to fetch pagineted question answers ', async () => {

    for(let i = 1; i <= 22; i++){
        await inMemoryAnswerRepository.create(makeAnswer({
            questionId: new UniqueEntityId('question-1')
          }))

    }

    const result = await sut.execute({
        questionId: 'question-1',
      page: 2
    })


    expect(result.value?.answers).toHaveLength(2)
})
})


