import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { Question } from '../../enterprise/entities/question';
import { QuestionRepository } from '../repositories/question-repository';
import { Either, right } from '@/core/either';
import { QuestionAttachment } from '../../enterprise/entities/question-attachment';
import { QuestionAttachmentList } from '../../enterprise/entities/question-attachments-list';

interface CreateQuestionUseCaseRequest {
authorId: string
title: string
content: string
attachmentsIds: string[]
}

type CreateQuestionUseCaseResponse = Either<
null,
 {
   question: Question
  }
>
export class CreateQuestionUseCase {
  constructor(private questionRepository: QuestionRepository) {}

  async execute({
    authorId,
    title,
    content,
    attachmentsIds
  }: CreateQuestionUseCaseRequest): Promise<CreateQuestionUseCaseResponse> {
    
    const question= Question.create({
        authorId: new UniqueEntityId(authorId),
        title,
        content
    })

    const questionAttachements = attachmentsIds.map(attachmentId =>{
      return QuestionAttachment.create({
        attachmentId: new UniqueEntityId(attachmentId),
        questionId: question.id
      })
    })

    question.attachemnts = new QuestionAttachmentList(questionAttachements)

    await this.questionRepository.create(question)

    return right( {
        question
    })

  }
}
