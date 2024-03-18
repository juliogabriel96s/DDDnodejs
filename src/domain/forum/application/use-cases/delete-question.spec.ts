import { expect, it, beforeEach } from 'vitest'
import { InMemoryQuestionRepository } from 'test/repositories/in-memory-question-repository'
import { makeQuestion } from 'test/factories/make-question'
import { DeleteQuestionUseCase } from './delete-question'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { NotAllowedError } from './errors/not-allowed-error'
import { InMemoryQuestionAttachmentRepository } from 'test/repositories/in-memory-question-attachment-repository'
import { makeQuestionAttachment } from 'test/factories/make-question-attachments'

let inMemoryQuestionRepository: InMemoryQuestionRepository
let inMemoryQuestionAttachmentsRepository: InMemoryQuestionAttachmentRepository
let sut: DeleteQuestionUseCase

describe('Delete question', () =>{

  beforeEach(() =>{
    inMemoryQuestionAttachmentsRepository = new InMemoryQuestionAttachmentRepository()
    inMemoryQuestionRepository = new InMemoryQuestionRepository(inMemoryQuestionAttachmentsRepository)
    sut = new DeleteQuestionUseCase(inMemoryQuestionRepository)

  })
  
  it('Should be able to delete a question', async () => {

    const newQuestion = makeQuestion({
        authorId: new UniqueEntityId('author-1')
    }, new UniqueEntityId('question-1'))

    console.log(newQuestion)
    inMemoryQuestionRepository.create(newQuestion)

    inMemoryQuestionAttachmentsRepository.items.push(
      makeQuestionAttachment({
      questionId: newQuestion.id,
      attachmentId: new UniqueEntityId('1')
    }),
    makeQuestionAttachment({
      questionId: newQuestion.id,
      attachmentId: new UniqueEntityId('2')
    })
    )
  
   await sut.execute({
    authorId: 'author-1',
    questionId: 'question-1'
    })
  
   expect(inMemoryQuestionRepository.items).toHaveLength(0)
   expect(inMemoryQuestionAttachmentsRepository.items).toHaveLength(0)
   

  })

  it('Should be able to delete a question from another use', async () => {

    const newQuestion = makeQuestion({
        authorId: new UniqueEntityId('author-1')
    }, new UniqueEntityId('question-1'))

    console.log(newQuestion)
    inMemoryQuestionRepository.create(newQuestion)
  
    const result = await sut.execute({
      authorId: 'author-2',
      questionId: 'question-1'
      })
  
     expect(result.isLeft()).toBe(true)  
     expect(result.value).toBeInstanceOf(NotAllowedError)

  })
})


