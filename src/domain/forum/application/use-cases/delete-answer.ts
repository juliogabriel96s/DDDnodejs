import { Either, left, right } from "@/core/either"
import { AnswerRepository } from "../repositories/answer-repository"
import { ResourceNotFoundError } from "./errors/resource-not-found-error"
import { NotAllowedError } from "./errors/not-allowed-error"

interface DeleteAnswerUseCaseRequest {
authorId: string
answerId: string
}

type DeleteAnswerUseCaseResponse = Either<
ResourceNotFoundError | NotAllowedError,
 {} 
  >

export class DeleteAnswerUseCase {
  constructor(private AnswerRepository: AnswerRepository) {}

  async execute({
    authorId,
    answerId
  }: DeleteAnswerUseCaseRequest): Promise<DeleteAnswerUseCaseResponse> {
    const Answer = await this.AnswerRepository.findById(answerId)

    if(!Answer){
        return left(new ResourceNotFoundError())
    }

    if(authorId !== Answer.authorId.toString()){
        return left(new NotAllowedError())
    }

    await this.AnswerRepository.delete(Answer)

    return right ({
        
    })

  }
}
