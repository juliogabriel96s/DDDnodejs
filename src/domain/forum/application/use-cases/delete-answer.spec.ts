import { expect, it, beforeEach } from 'vitest'
import { InMemoryAnswerRepository } from 'test/repositories/in-memory-answer-repository'
import { DeleteAnswerUseCase } from './delete-answer'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { makeAnswer } from 'test/factories/make-answer'
import { NotAllowedError } from './errors/not-allowed-error'

let inMemoryAnswerRepository: InMemoryAnswerRepository
let sut: DeleteAnswerUseCase

describe('Delete Answer', () =>{

  beforeEach(() =>{
    inMemoryAnswerRepository = new InMemoryAnswerRepository()
    sut = new DeleteAnswerUseCase(inMemoryAnswerRepository)

  })
  
  it('Should be able to delete a Answer', async () => {

    const newAnswer = makeAnswer({
        authorId: new UniqueEntityId('author-1')
    }, new UniqueEntityId('answer-1'))

    console.log(newAnswer)
    inMemoryAnswerRepository.create(newAnswer)
  
   await sut.execute({
    answerId: 'answer-1',
    authorId: 'author-1'
   
    })
  
   expect(inMemoryAnswerRepository.items).toHaveLength(0)
   

  })

  it('Should be able to delete a Answer from another use', async () => {

    const newAnswer = makeAnswer({
        authorId: new UniqueEntityId('author-1')
    }, new UniqueEntityId('answer-1'))

    console.log(newAnswer)
    inMemoryAnswerRepository.create(newAnswer)
  
    const result = await sut.execute({
      authorId: 'author-2',
      answerId: 'answer-1'
      })

      expect(result.isLeft()).toBe(true)  
      expect(result.value).toBeInstanceOf(NotAllowedError)
   

  })
})


