import { expect, it, beforeEach } from 'vitest'
import { CreateQuestionUseCase } from './create-question'
import { InMemoryQuestionRepository } from 'test/repositories/in-memory-question-repository'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { InMemoryQuestionAttachmentRepository } from 'test/repositories/in-memory-question-attachment-repository'

let inMemoryQuestionRepository: InMemoryQuestionRepository
let inMemoryQuestionAttachmentsRepository: InMemoryQuestionAttachmentRepository
let sut: CreateQuestionUseCase

describe('create question', () =>{

  beforeEach(() =>{
    inMemoryQuestionAttachmentsRepository = new InMemoryQuestionAttachmentRepository()
    inMemoryQuestionRepository = new InMemoryQuestionRepository(inMemoryQuestionAttachmentsRepository)
    sut = new CreateQuestionUseCase(inMemoryQuestionRepository)

  })
  
  it('Should be able to create a question', async () => {
  
    const result = await sut.execute({
     authorId: '1',
     title: 'New question',
      content: 'conteudo da pergunta',
      attachmentsIds: ['1', '2']
    })
  
    expect(result.isRight()).toBe(true)
    expect(inMemoryQuestionRepository.items[0]).toEqual(result.value?.question)
    expect(inMemoryQuestionRepository.items[0].attachments.currentItems).toHaveLength(2)
    expect(inMemoryQuestionRepository.items[0].attachments.currentItems).toEqual([
      expect.objectContaining({attachmentId: new UniqueEntityId('1')}),
      expect.objectContaining({attachmentId: new UniqueEntityId('2')})

    ])
  })
})


