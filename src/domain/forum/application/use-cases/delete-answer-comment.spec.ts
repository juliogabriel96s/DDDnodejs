import { expect, it, beforeEach } from 'vitest'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { InMemoryAnswerCommentRepository } from 'test/repositories/in-memory-answer-comment-repository'
import { DeleteAnswerCommentUseCase } from './delete-answer-comment'
import { makeAnswerComment } from 'test/factories/make-answer-comment'
import { NotAllowedError } from './errors/not-allowed-error'

let inMemoryAnswerCommentRepository: InMemoryAnswerCommentRepository
let sut: DeleteAnswerCommentUseCase

describe('Delete on answer', () =>{

  beforeEach(() =>{
  
    inMemoryAnswerCommentRepository = new InMemoryAnswerCommentRepository()
    sut = new DeleteAnswerCommentUseCase(
       inMemoryAnswerCommentRepository
        )

  })
  
  it('Should be able to delete a question comment', async () => {

    const answerComment = makeAnswerComment()

  

    await inMemoryAnswerCommentRepository.create(answerComment)

  
   await sut.execute({
    answerCommentId: answerComment.id.toString(),
    authorId: answerComment.authorId.toString(),   
    })
  
expect(inMemoryAnswerCommentRepository.items).toHaveLength(0)  

  })


  it('Should not be able to delete another user question comment', async () => {

    const answerComment = makeAnswerComment({
        authorId: new UniqueEntityId('author-01')
    })

  

    await inMemoryAnswerCommentRepository.create(answerComment)

    const result = await sut.execute({
      answerCommentId: answerComment.id.toString(),
      authorId: 'author-2', 
}) 


expect(result.isLeft()).toBe(true)  
expect(result.value).toBeInstanceOf(NotAllowedError)
  })

})


