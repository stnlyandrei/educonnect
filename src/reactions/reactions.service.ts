import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Reaction } from './reaction.entity';

@Injectable()
export class ReactionsService {
  constructor(
    @InjectRepository(Reaction)
    private reactionsRepository: Repository<Reaction>,
  ) {}

  async addReaction(userId: number, postId: number): Promise<Reaction> {
    const existingReaction = await this.reactionsRepository.findOne({
      where: { userId, postId },
    });

    if (existingReaction) {
      throw new ConflictException('You already marked this post as helpful');
    }

    const newReaction = this.reactionsRepository.create({ userId, postId });
    return this.reactionsRepository.save(newReaction);
  }

  async removeReaction(userId: number, postId: number): Promise<void> {
    const reaction = await this.reactionsRepository.findOne({
      where: { userId, postId },
    });

    if (!reaction) {
      throw new NotFoundException('Reaction not found');
    }

    await this.reactionsRepository.remove(reaction);
  }
}