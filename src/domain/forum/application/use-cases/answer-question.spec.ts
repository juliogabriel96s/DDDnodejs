import { expect, it, beforeEach } from 'vitest'
import { InMemoryAnswerRepository } from 'test/repositories/in-memory-answer-repository'
import { AnswerQuestionUseCase } from './answer-question'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'

let inMemoryAnswerRepository: InMemoryAnswerRepository
let sut: AnswerQuestionUseCase

describe('create answer', () =>{

  beforeEach(() =>{
    inMemoryAnswerRepository = new InMemoryAnswerRepository()
    sut = new AnswerQuestionUseCase(inMemoryAnswerRepository)

  })
  
  it('Should be able to create an answer', async () => {
  
    const result = await sut.execute({
     questionId: '1',
     instructorId: '1',
      content: 'conteudo da resposta',
      attachmentsIds: ['1', '2']
    })
  
    expect(result.isRight()).toBe(true)
    expect(inMemoryAnswerRepository.items[0]).toEqual(result.value?.answer)
    expect(inMemoryAnswerRepository.items[0].attachments.currentItems).toHaveLength(2)
    expect(inMemoryAnswerRepository.items[0].attachments.currentItems).toEqual([
      expect.objectContaining({attachmentId: new UniqueEntityId('1')}),
      expect.objectContaining({attachmentId: new UniqueEntityId('2')})
    ])
  
  })
})