import { expect, it, beforeEach } from 'vitest'
import { InMemoryAnswerRepository } from 'test/repositories/in-memory-answer-repository'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { makeAnswer } from 'test/factories/make-answer'
import { InMemoryQuestionRepository } from 'test/repositories/in-memory-question-repository'
import { ChooseQuestionBestAnswerUseCase } from './choose-question-best-answer'
import { makeQuestion } from 'test/factories/make-question'
import { NotAllowedError } from './errors/not-allowed-error'

let inMemoryQuestionRepository: InMemoryQuestionRepository
let inMemoryAnswerRepository: InMemoryAnswerRepository
let sut: ChooseQuestionBestAnswerUseCase

describe('Choose question best answer', () =>{

  beforeEach(() =>{
    inMemoryQuestionRepository = new InMemoryQuestionRepository()
    inMemoryAnswerRepository = new InMemoryAnswerRepository()
    sut = new ChooseQuestionBestAnswerUseCase(
        inMemoryQuestionRepository,
        inMemoryAnswerRepository
        )

  })
  
  it('Should be able to choose the question best answer', async () => {

    const question = makeQuestion()

    const answer =  makeAnswer({
        questionId: question.id
    })

    await inMemoryQuestionRepository.create(question)
    await inMemoryAnswerRepository.create(answer)

  
   await sut.execute({
    answerId: answer.id.toString(),
    authorId: question.authorId.toString()
   
    })
  
expect(inMemoryQuestionRepository.items[0].bestAnswerId).toEqual(answer.id)   

  })

  it('Should be able to choose another user question best answer', async () => {

    const question = makeQuestion({
        authorId: new UniqueEntityId('author-1')
    })

    const answer =  makeAnswer({
        questionId: question.id
    })

    await inMemoryQuestionRepository.create(question)
    await inMemoryAnswerRepository.create(answer)
  
    const result = await sut.execute({
      authorId: 'author-2',
      answerId: answer.id.toString()
      })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(NotAllowedError)
  
   

  })
})


