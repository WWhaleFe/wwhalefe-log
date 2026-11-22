import styled from "@emotion/styled"
import Image from "next/image"
import React from "react"
import { CONFIG } from "site.config"
import SectionTitle from "src/components/SectionTitle"

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
      <SectionTitle>Profile</SectionTitle>
      <div className="content">
        <div className="top">
          <Image src={CONFIG.profile.image} fill alt="" />
        </div>
        <div className="mid">
          <div className="name">{CONFIG.profile.name}</div>
          <div className="role">{CONFIG.profile.role}</div>
          {CONFIG.profile.bio !== CONFIG.profile.role && (
            <div className="bio">{CONFIG.profile.bio}</div>
          )}
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
  padding: 0.75rem;
  gap: 0.75rem;
  align-items: center;
  border-radius: 1.5rem;
  ${({ theme }) => theme.surfaces.clay}

  .image {
    position: relative;
    flex: 0 0 3.5rem;
    height: 3.5rem;
    overflow: hidden;
    border-radius: 1rem;
    ${({ theme }) => theme.surfaces.hatch}
  }

  .info {
    min-width: 0;
  }

  .name {
    overflow: hidden;
    font-size: 1rem;
    line-height: 1.375rem;
        font-weight: 600;
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
  > .content {
    view-transition-name: profile-box;
    margin-bottom: 2rem;
    padding: 0.5rem;
    border-radius: 1.75rem;
    width: 100%;
    ${({ theme }) => theme.surfaces.clay}

    /* 사진 칸은 판 안에 한 겹 들어간 사선 무늬 홈 */
    .top {
      position: relative;
      width: 100%;
      overflow: hidden;
      border-radius: 1.25rem;
      ${({ theme }) => theme.surfaces.hatch}
      &:after {
        content: "";
        display: block;
        padding-bottom: 100%;
      }
    }
    .mid {
      display: flex;
      padding: 0.75rem 0.5rem 0.5rem;
      flex-direction: column;
      align-items: center;
      gap: 0.25rem;
      .name {
        font-size: 1.125rem;
        line-height: 1.5rem;
        font-weight: 600;
      }
      .role {
        padding: 0.125rem 0.5rem;
        border-radius: 9999px;
        font-family: ${({ theme }) => theme.variables.monoFont};
        font-size: 0.75rem;
        line-height: 1rem;
        color: ${({ theme }) => theme.colors.gray11};
        ${({ theme }) => theme.surfaces.claySoft}
      }
      .bio {
        margin-top: 0.5rem;
        font-size: 0.875rem;
        line-height: 1.25rem;
        text-align: center;
        color: ${({ theme }) => theme.colors.gray11};
      }
    }
  }
`
