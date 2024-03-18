import { expect, it, beforeEach } from 'vitest'
import { InMemoryQuestionRepository } from 'test/repositories/in-memory-question-repository'
import { makeQuestion } from 'test/factories/make-question'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { EditQuestionUseCase } from './edit-question'
import { NotAllowedError } from './errors/not-allowed-error'
import { InMemoryQuestionAttachmentRepository } from 'test/repositories/in-memory-question-attachment-repository'
import { makeQuestionAttachment } from 'test/factories/make-question-attachments'

let inMemoryQuestionRepository: InMemoryQuestionRepository
let inMemoryQustionAttachmentsRepository: InMemoryQuestionAttachmentRepository
let sut: EditQuestionUseCase

describe('Edit question', () =>{

  beforeEach(() =>{
    inMemoryQustionAttachmentsRepository =  new InMemoryQuestionAttachmentRepository()
    inMemoryQuestionRepository = new InMemoryQuestionRepository(inMemoryQustionAttachmentsRepository)
    sut = new EditQuestionUseCase(inMemoryQuestionRepository, inMemoryQustionAttachmentsRepository)

  })
  
  it('Should be able to edit a question', async () => {

    const newQuestion = makeQuestion({
        authorId: new UniqueEntityId('author-1')
    }, new UniqueEntityId('question-1'))

    inMemoryQuestionRepository.create(newQuestion)

    inMemoryQustionAttachmentsRepository.items.push(
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
    questionId: newQuestion.id.toValue(),
    authorId: 'author-1',
    title: 'pergunta teste',
    content: 'conteudo teste',
    attachmentsIds: ['1', '3']
 })
  
   expect(inMemoryQuestionRepository.items[0]).toMatchObject({
    title: 'pergunta teste',
    content: 'conteudo teste'
   })
   expect(inMemoryQuestionRepository.items[0].attachments.currentItems).toHaveLength(2)
   expect(inMemoryQuestionRepository.items[0].attachments.currentItems).toEqual([
     expect.objectContaining({attachmentId: new UniqueEntityId('1')}),
     expect.objectContaining({attachmentId: new UniqueEntityId('3')})

   ])

  })

  it('Should be able to edit a question from another use', async () => {

    const newQuestion = makeQuestion({
        authorId: new UniqueEntityId('author-1')
    }, new UniqueEntityId('question-1'))

    console.log(newQuestion)
    inMemoryQuestionRepository.create(newQuestion)
  
    const result = await sut.execute({
      questionId: newQuestion.id.toValue(),
      authorId: 'author-2',
      title: 'pergunta teste',
      content: 'conteudo teste',
      attachmentsIds: []
  })
  
     expect(result.isLeft()).toBe(true)  
     expect(result.value).toBeInstanceOf(NotAllowedError)

  })
})


