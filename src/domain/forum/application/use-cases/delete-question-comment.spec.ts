import { expect, it, beforeEach } from 'vitest'
import { InMemoryQuestionCommentRepository } from 'test/repositories/in-memory-question-comment-repository'
import { DeleteQuestionCommentUseCase } from './delete-question-comment'
import { makeQuestionComment } from 'test/factories/make-question-comment'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { NotAllowedError } from './errors/not-allowed-error'

let inMemoryQuestionCommentRepository: InMemoryQuestionCommentRepository
let sut: DeleteQuestionCommentUseCase

describe('Delete on question', () =>{

  beforeEach(() =>{
  
    inMemoryQuestionCommentRepository = new InMemoryQuestionCommentRepository()
    sut = new DeleteQuestionCommentUseCase(
       inMemoryQuestionCommentRepository
        )

  })
  
  it('Should be able to delete a question comment', async () => {

    const questionComment = makeQuestionComment()

  

    await inMemoryQuestionCommentRepository.create(questionComment)

  
   await sut.execute({
    questionCommentId: questionComment.id.toString(),
    authorId: questionComment.authorId.toString(),   
    })
  
expect(inMemoryQuestionCommentRepository.items).toHaveLength(0)  

  })


  it('Should not be able to delete another user question comment', async () => {

    const questionComment = makeQuestionComment({
        authorId: new UniqueEntityId('author-01')
    })

  

    await inMemoryQuestionCommentRepository.create(questionComment)

const result = await sut.execute({
  questionCommentId: questionComment.id.toString(),
  authorId: 'author-2', 
})
  
  expect(result.isLeft()).toBe(true)  
expect(result.value).toBeInstanceOf(NotAllowedError)

  })

})


