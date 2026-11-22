import { CONFIG } from "site.config"
import Image from "next/image"
import React from "react"
import styled from "@emotion/styled"
import SectionTitle from "src/components/SectionTitle"

type Props = {
  className?: string
}

const MobileProfileCard: React.FC<Props> = () => {
  return (
    <StyledWrapper>
      <SectionTitle>Profile</SectionTitle>
      <div className="mid">
        <div className="wrapper">
          <div className="photo">
            <Image
              src={CONFIG.profile.image}
              width={72}
              height={72}
              css={{ position: "relative", display: "block" }}
              alt="profile_image"
            />
          </div>
          <div className="wrapper">
            <div className="top">{CONFIG.profile.name}</div>
            <div className="mid">{CONFIG.profile.role}</div>
            {CONFIG.profile.bio !== CONFIG.profile.role && (
              <div className="btm">{CONFIG.profile.bio}</div>
            )}
          </div>
        </div>
      </div>
    </StyledWrapper>
  )
}

export default MobileProfileCard

const StyledWrapper = styled.div`
  display: block;

  @media (min-width: 1024px) {
    display: none;
  }

  > .mid {
    padding: 0.5rem;
    margin-bottom: 1.5rem;
    border-radius: 1.5rem;
    ${({ theme }) => theme.surfaces.clay}
    > .wrapper {
      display: flex;
      gap: 0.75rem;
      align-items: center;
      > .photo {
        flex: 0 0 auto;
        overflow: hidden;
        border-radius: 1rem;
        ${({ theme }) => theme.surfaces.hatch}
      }
      > .wrapper {
        height: fit-content;
        > .top {
          font-size: 1.125rem;
          line-height: 1.5rem;
          font-weight: 600;
        }
        > .mid {
          margin-top: 0.125rem;
          font-family: ${({ theme }) => theme.variables.monoFont};
          font-size: 0.75rem;
          line-height: 1rem;
          color: ${({ theme }) => theme.colors.gray11};
        }
        > .btm {
          margin-top: 0.375rem;
          font-size: 0.875rem;
          line-height: 1.25rem;
          color: ${({ theme }) => theme.colors.gray11};
        }
      }
    }
  }
`
