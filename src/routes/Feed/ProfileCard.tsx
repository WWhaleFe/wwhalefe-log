import styled from "@emotion/styled"
import Image from "next/image"
import React from "react"
import { CONFIG } from "site.config"
import { Emoji } from "src/components/Emoji"

type Props = {
  compact?: boolean
}

const ProfileCard: React.FC<Props> = ({ compact = false }) => {
  if (compact) {
    return (
      <StyledCompact>
        <div className="image">
          <Image src={CONFIG.profile.image} fill alt="" />
        </div>
        <div className="info">
          <div className="name">{CONFIG.profile.name}</div>
          <div className="role">{CONFIG.profile.role}</div>
          {CONFIG.profile.bio !== CONFIG.profile.role && (
            <div className="bio">{CONFIG.profile.bio}</div>
          )}
        </div>
      </StyledCompact>
    )
  }

  return (
    <StyledWrapper>
      <div className="title">
        <Emoji>💻</Emoji> Profile
      </div>
      <div className="content">
        <div className="top">
          <Image src={CONFIG.profile.image} fill alt="" />
        </div>
        <div className="mid">
          <div className=" name">{CONFIG.profile.name}</div>
          <div className="role">{CONFIG.profile.role}</div>
          <div className="text-sm mb-2">{CONFIG.profile.bio}</div>
        </div>
      </div>
    </StyledWrapper>
  )
}

export default ProfileCard

const StyledCompact = styled.div`
  view-transition-name: profile-box;
  display: flex;
  margin-bottom: 1.5rem;
  padding: 0.75rem 1rem;
  gap: 0.75rem;
  align-items: center;
  border-radius: 1.5rem;
  ${({ theme }) => theme.surfaces.clay}

  .image {
    position: relative;
    flex: 0 0 3.5rem;
    height: 3.5rem;
  }

  .info {
    min-width: 0;
  }

  .name {
    overflow: hidden;
    font-size: 1rem;
    line-height: 1.375rem;
    font-style: italic;
    font-weight: 700;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .role,
  .bio {
    font-size: 0.8125rem;
    line-height: 1.125rem;
    color: ${({ theme }) => theme.colors.gray11};
  }

  .bio {
    display: -webkit-box;
    overflow: hidden;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
  }
`

const StyledWrapper = styled.div`
  > .title {
    padding: 0.25rem;
    margin-bottom: 0.75rem;
  }
  > .content {
    view-transition-name: profile-box;
    margin-bottom: 2.25rem;
    border-radius: 1.75rem;
    width: 100%;
    ${({ theme }) => theme.surfaces.clay}
    @media (min-width: 768px) {
      padding: 1rem;
    }
    @media (min-width: 1024px) {
      padding: 1rem;
    }
    .top {
      position: relative;
      width: 100%;
      &:after {
        content: "";
        display: block;
        padding-bottom: 100%;
      }
    }
    .mid {
      display: flex;
      padding: 0.5rem;
      flex-direction: column;
      align-items: center;
      .name {
        font-size: 1.25rem;
        line-height: 1.75rem;
        font-style: italic;
        font-weight: 700;
      }
      .role {
        margin-bottom: 1rem;
        font-size: 0.875rem;
        line-height: 1.25rem;
        color: ${({ theme }) => theme.colors.gray11};
      }
      .bio {
        margin-bottom: 0.5rem;
        font-size: 0.875rem;
        line-height: 1.25rem;
      }
    }
  }
`
