
import { Either, left, right } from '@/core/either';
import { Question } from '../../enterprise/entities/question';
import { QuestionRepository } from '../repositories/question-repository';
import { ResourceNotFoundError } from './errors/resource-not-found-error';
import { NotAllowedError } from './errors/not-allowed-error';
import { QuestionAttachmentRepository } from '../repositories/question-attachment-repository';
import { QuestionAttachmentList } from '../../enterprise/entities/question-attachments-list';
import { QuestionAttachment } from '../../enterprise/entities/question-attachment';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';

interface EditQuestionUseCaseRequest {
authorId: string
questionId: string
title: string
content: string
attachmentsIds: string[]
}

type EditQuestionUseCaseResponse = Either<
ResourceNotFoundError | NotAllowedError,
{
  question: Question
  }
  >

export class EditQuestionUseCase {
  constructor(
    private questionRepository: QuestionRepository,
    private questionAttachmentRepository: QuestionAttachmentRepository
    ) {}

  async execute({
    authorId,
    questionId,
    title,
    content,
    attachmentsIds
  }: EditQuestionUseCaseRequest): Promise<EditQuestionUseCaseResponse> {
    const question = await this.questionRepository.findById(questionId)

    if(!question){
        return left(new ResourceNotFoundError())
    }

    if(authorId !== question.authorId.toString()){
        return left(new NotAllowedError())
    }

    const currentQuestionAttachment = await this.questionAttachmentRepository.findManyByQuestionId(questionId)

    const questionAttachmentList = new QuestionAttachmentList(currentQuestionAttachment)

    const questionAttachements = attachmentsIds.map(attachmentId =>{
      return QuestionAttachment.create({
        attachmentId: new UniqueEntityId(attachmentId),
        questionId: question.id
      })
    })

    questionAttachmentList.update(questionAttachements)

    question.title = title
    question.content = content
    question.attachemnts = questionAttachmentList

    await this.questionRepository.save(question)

    return right( {
        question
    })

  }
}
