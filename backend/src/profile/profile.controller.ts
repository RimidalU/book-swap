import {
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
} from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'

import { JwtAuthGuard } from '@src/auth/jwt-auth.guard'
import { UserInfo } from '@src/user/decorators/user-info.decorator'
import { ProfileService } from '@src/profile/profile.service'
import {
  FollowProfileSwaggerDecorator,
  GetProfileSwaggerDecorator,
} from '@src/profile/decorators'

import {
  ProfileConfirmationResponseDto,
  ProfileResponseDto,
} from '@src/profile/dto'
import { ProfileType } from '@src/profile/types'
import { ProfileItemDto } from '@src/profile/dto/profile-item.dto'

@Controller('profile')
@ApiTags('Profile routes')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  @GetProfileSwaggerDecorator()
  async getProfile(
    @Param('id', ParseIntPipe) id: number,
    @UserInfo('id') currentUserId: number,
  ): Promise<ProfileResponseDto> {
    const profileInfo = await this.profileService.getProfile(currentUserId, id)

    return {
      profile: this.buildProfileResponse(profileInfo),
    }
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id')
  @FollowProfileSwaggerDecorator()
  async followProfile(
    @Param('id', ParseIntPipe) id: number,
    @UserInfo('id') currentUserId: number,
  ) {
    const profileId = await this.profileService.followProfile(currentUserId, id)
    return this.buildProfileConfirmationResponse(profileId)
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async unFollowProfile(
    @Param('id', ParseIntPipe) id: number,
    @UserInfo('id') currentUserId: number,
  ): Promise<ProfileConfirmationResponseDto> {
    const profileId = await this.profileService.unFollowProfile(
      currentUserId,
      id,
    )

    return this.buildProfileConfirmationResponse(profileId)
  }

  private buildProfileResponse(profile: ProfileType): ProfileItemDto {
    return {
      itemId: profile.id,
      item: {
        name: profile.name,
        bio: profile.bio,
        avatar: profile.avatar,
        following: profile.following,
      },
    }
  }

  private buildProfileConfirmationResponse(
    profileId: number,
  ): ProfileConfirmationResponseDto {
    return {
      profile: {
        itemId: profileId,
      },
    }
  }
}
