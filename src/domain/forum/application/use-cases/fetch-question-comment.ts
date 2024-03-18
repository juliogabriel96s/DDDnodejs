import { Either, right } from '@/core/either';
import { QuestionComment } from '../../enterprise/entities/question-comment';
import { QuestionCommentRepository } from '../repositories/question-comment-repository';

interface FetchQuestionsCommentsUseCaseRequest {
    questionId: string
    page: number
}

type FetchQuestionsCommentsUseCaseResponse = Either<
null,
{
   questionComments: QuestionComment[]
  }
>
export class FetchQuestionsCommentsUseCase {
  constructor(private questionCommentRepository: QuestionCommentRepository) {}

  async execute({
    questionId,
   page
  }: FetchQuestionsCommentsUseCaseRequest): Promise<FetchQuestionsCommentsUseCaseResponse> {
    
    const questionComments=  await this.questionCommentRepository.findManyByQuestionId(questionId, {page})



    return right( {
        questionComments
    })

  }
}
