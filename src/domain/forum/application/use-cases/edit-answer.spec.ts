import { expect, it, beforeEach } from 'vitest'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { EditanswerUseCase } from './edit-answer'
import { InMemoryAnswerRepository } from 'test/repositories/in-memory-answer-repository'
import { makeAnswer } from 'test/factories/make-answer'
import { NotAllowedError } from './errors/not-allowed-error'

let inMemoryAnswerRepository: InMemoryAnswerRepository
let sut: EditanswerUseCase

describe('Edit answer', () =>{

  beforeEach(() =>{
    inMemoryAnswerRepository = new InMemoryAnswerRepository()
    sut = new EditanswerUseCase(inMemoryAnswerRepository)

  })
  
  it('Should be able to edit a answer', async () => {

    const newAnswer = makeAnswer({
        authorId: new UniqueEntityId('author-1')
    }, new UniqueEntityId('answer-1'))

    inMemoryAnswerRepository.create(newAnswer)
  
   await sut.execute({
    answerId: newAnswer.id.toValue(),
    authorId: 'author-1',
    content: 'conteudo teste'
 })
  
   expect(inMemoryAnswerRepository.items[0]).toMatchObject({
    content: 'conteudo teste'
   })
   

  })

  it('Should be able to edit a answer from another use', async () => {

    const newAnswer = makeAnswer({
        authorId: new UniqueEntityId('author-1')
    }, new UniqueEntityId('answer-1'))

    inMemoryAnswerRepository.create(newAnswer)
  
    const result = await sut.execute({
      answerId: newAnswer.id.toValue(),
      authorId: 'author-2',
      content: 'conteudo teste'
  })
  
     expect(result.isLeft()).toBe(true)  
     expect(result.value).toBeInstanceOf(NotAllowedError)

  })
})


