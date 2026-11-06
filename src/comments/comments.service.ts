import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comment } from './comment.entity';
import { CreateCommentDto } from './create-comment.dto';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment)
    private commentsRepository: Repository<Comment>,
  ) {}

  async create(createCommentDto: CreateCommentDto, userId: number, postId: number): Promise<Comment> {
    const newComment = this.commentsRepository.create({
      ...createCommentDto,
      userId,
      postId,
    });
    return this.commentsRepository.save(newComment);
  }

  async findByPost(postId: number): Promise<Comment[]> {
    return this.commentsRepository.find({ 
      where: { postId },
      relations: { user: true } 
    });
  }

  async remove(commentId: number, userId: number): Promise<void> {
    const comment = await this.commentsRepository.findOne({ where: { commentId } });
    if (!comment) throw new NotFoundException('Comment not found');
    // Optional: Pwede mong i-check kung userId === comment.userId bago i-delete
    await this.commentsRepository.remove(comment);
  }
}