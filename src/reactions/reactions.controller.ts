import { Controller, Post, Delete, Param, UseGuards, Req } from '@nestjs/common';
import { ReactionsService } from './reactions.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('posts/:postId/reactions')
export class ReactionsController {
  constructor(private readonly reactionsService: ReactionsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async addReaction(@Param('postId') postId: string, @Req() req: any) {
    return this.reactionsService.addReaction(req.user.userId, +postId);
  }

  @UseGuards(JwtAuthGuard)
  @Delete()
  async removeReaction(@Param('postId') postId: string, @Req() req: any) {
    await this.reactionsService.removeReaction(req.user.userId, +postId);
    return { message: 'Reaction removed successfully' };
  }
}