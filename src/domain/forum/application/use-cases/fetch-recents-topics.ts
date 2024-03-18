import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { Question } from '../../enterprise/entities/question';
import { QuestionRepository } from '../repositories/question-repository';
import { Either, right } from '@/core/either';

interface FetchRecentsQuestionsUseCaseRequest {
page: number
}

type FetchRecentsQuestionsUseCaseResponse = Either<
null,
 {
   questions: Question[]
  }
>
export class FetchRecentsQuestionsUseCase {
  constructor(private questionRepository: QuestionRepository) {}

  async execute({
   page
  }: FetchRecentsQuestionsUseCaseRequest): Promise<FetchRecentsQuestionsUseCaseResponse> {
    
    const questions=  await this.questionRepository.findManyRecent({page})



    return right( {
        questions
    })

  }
}
