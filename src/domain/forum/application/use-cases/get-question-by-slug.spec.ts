import { expect, it, beforeEach } from 'vitest'
import { InMemoryQuestionRepository } from 'test/repositories/in-memory-question-repository'
import { GetQuestionBySlugUseCase } from './get-question-by-slug'
import { makeQuestion } from 'test/factories/make-question'
import { Slug } from '../../enterprise/entities/value-objects/slug'

let inMemoryQuestionRepository: InMemoryQuestionRepository
let sut: GetQuestionBySlugUseCase

describe('get question by slug', () =>{

  beforeEach(() =>{
    inMemoryQuestionRepository = new InMemoryQuestionRepository()
    sut = new GetQuestionBySlugUseCase(inMemoryQuestionRepository)

  })
  
  it('Should be able to get a question by slug', async () => {

    const newQuestion = makeQuestion({
        slug: Slug.create('example-question')
    })

    console.log(newQuestion)
    inMemoryQuestionRepository.create(newQuestion)
  
    const result = await sut.execute({
    slug: 'example-question'
    })
  
    expect(result.value).toMatchObject({
      question: expect.objectContaining({
        title: newQuestion.title,
      }),
    })
   

  })
})


