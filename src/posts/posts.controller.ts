import { Controller, Post, Body, UseGuards, Req, SetMetadata, Get, Param, Patch, Delete } from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './create-post.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @SetMetadata('roles', ['Teacher', 'Admin'])
  @Post()
  async create(@Body() createPostDto: CreatePostDto, @Req() req: any) {
    return this.postsService.create(createPostDto, req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async findAll() {
    return this.postsService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.postsService.findOne(+id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @SetMetadata('roles', ['Teacher', 'Admin'])
  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateData: Partial<CreatePostDto>) {
    // Note: Pwede pa nating i-strict dito na Owner lang ang pwedeng mag-edit, 
    // pero for now, hayaan muna natin si Teacher/Admin.
    return this.postsService.update(+id, updateData);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @SetMetadata('roles', ['Teacher', 'Admin'])
  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.postsService.remove(+id);
    return { message: 'Post deleted successfully' };
  }
}