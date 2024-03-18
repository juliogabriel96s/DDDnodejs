import { Either, left, right } from '@/core/either'
import { UniqueEntityId } from '../../../../core/entities/unique-entity-id'
import { Answer } from '../../enterprise/entities/answer'
import { Question } from '../../enterprise/entities/question'
import { AnswerRepository } from '../repositories/answer-repository'
import { QuestionRepository } from '../repositories/question-repository'
import { ResourceNotFoundError } from './errors/resource-not-found-error'
import { NotAllowedError } from './errors/not-allowed-error'

interface ChooseQuestionBestAnswerUseCaseRequest {
 answerId: string
 authorId: string
}

type ChooseQuestionBestAnswerUseCaseResponse = Either<
ResourceNotFoundError | NotAllowedError,
{
 question: Question
}
>
export class ChooseQuestionBestAnswerUseCase {
  constructor(
    private questionRepository: QuestionRepository,
    private answerRepository: AnswerRepository
    ) {}

  async execute({
    answerId,
    authorId
  }: ChooseQuestionBestAnswerUseCaseRequest): Promise<ChooseQuestionBestAnswerUseCaseResponse> {
    const answer = await this.answerRepository.findById(answerId)

    if(!answer){
       return left(new ResourceNotFoundError())
    }
     
    const question =  await this.questionRepository.findById(
        answer.questionAId.toString()
    )

    if(!question){
    return left(new ResourceNotFoundError())
    }
    
    if(authorId !== question.authorId.toString()){
return left(new NotAllowedError())
    }

    question.bestAnswerId = answer.id

    await this.questionRepository.save(question)

    return right({
        question
    })
    }
}
