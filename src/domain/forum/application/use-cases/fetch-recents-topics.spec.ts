import { expect, it, beforeEach } from 'vitest'
import { InMemoryQuestionRepository } from 'test/repositories/in-memory-question-repository'
import { FetchRecentsQuestionsUseCase } from './fetch-recents-topics'
import { makeQuestion } from 'test/factories/make-question'
import { InMemoryQuestionAttachmentRepository } from 'test/repositories/in-memory-question-attachment-repository'

let inMemoryQuestionRepository: InMemoryQuestionRepository
let inMemoryQuestionAttachmentsRepository: InMemoryQuestionAttachmentRepository
let sut: FetchRecentsQuestionsUseCase

describe('fetch recent question', () =>{

  beforeEach(() =>{
    inMemoryQuestionAttachmentsRepository = new InMemoryQuestionAttachmentRepository()
    inMemoryQuestionRepository = new InMemoryQuestionRepository(inMemoryQuestionAttachmentsRepository)
    sut = new FetchRecentsQuestionsUseCase(inMemoryQuestionRepository)

  })
  
  it('Should be able to fetch recent question', async () => {
      await inMemoryQuestionRepository.create(makeQuestion({createdAt: new Date(2022, 0, 20)}))
      await inMemoryQuestionRepository.create(makeQuestion({createdAt: new Date(2022, 0, 18)}))
      await inMemoryQuestionRepository.create(makeQuestion({createdAt: new Date(2022, 0, 23)}))

      const result = await sut.execute({
        page: 1
      })


      expect(result.value?.questions).toEqual([
        expect.objectContaining({createdAt: new Date(2022, 0, 23)}),
        expect.objectContaining({createdAt: new Date(2022, 0, 20)}),
        expect.objectContaining({createdAt: new Date(2022, 0, 18)})
 ])
  })

  it('Should be able to fetch pagineted recent question', async () => {

    for(let i = 1; i <= 22; i++){
        await inMemoryQuestionRepository.create(makeQuestion())

    }

    const result = await sut.execute({
      page: 2
    })


    expect(result.value?.questions).toHaveLength(2)
})
})


