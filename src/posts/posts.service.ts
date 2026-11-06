import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post } from './post.entity';
import { CreatePostDto } from './create-post.dto';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post)
    private postsRepository: Repository<Post>,
  ) {}

  async create(createPostDto: CreatePostDto, userId: number): Promise<Post> {
    const newPost = this.postsRepository.create({
      ...createPostDto,
      userId,
    });
    return this.postsRepository.save(newPost);
  }

  async findAll(): Promise<Post[]> {
    return this.postsRepository.find({ relations: { user: true } });
  }

  async findOne(postId: number): Promise<Post> {
    const post = await this.postsRepository.findOne({ 
      where: { postId }, 
      relations: { user: true } 
    });
    if (!post) throw new NotFoundException('Post not found');
    return post;
  }

  async update(postId: number, updateData: Partial<CreatePostDto>): Promise<Post> {
    const post = await this.findOne(postId);
    Object.assign(post, updateData);
    return this.postsRepository.save(post);
  }

  async remove(postId: number): Promise<void> {
    const post = await this.findOne(postId);
    await this.postsRepository.remove(post);
  }
}