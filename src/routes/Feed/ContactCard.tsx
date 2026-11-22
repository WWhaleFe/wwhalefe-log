import styled from "@emotion/styled"
import React from "react"
import {
  AiFillLinkedin,
  AiOutlineGithub,
  AiOutlineInstagram,
  AiOutlineMail,
} from "react-icons/ai"
import { CONFIG } from "site.config"
import { FiArrowUpRight } from "react-icons/fi"
import SectionTitle from "src/components/SectionTitle"

const ContactCard: React.FC = () => {
  return (
    <>
      <SectionTitle>Contact</SectionTitle>
      <StyledWrapper>
        {CONFIG.profile.github && (
          <a
            href={`https://github.com/${CONFIG.profile.github}`}
            rel="noreferrer"
            target="_blank"
          >
            <AiOutlineGithub className="icon" />
            <div className="name">github</div>
            <FiArrowUpRight className="go" aria-hidden />
          </a>
        )}
        {CONFIG.profile.instagram && (
          <a
            href={`https://www.instagram.com/${CONFIG.profile.instagram}`}
            rel="noreferrer"
            target="_blank"
          >
            <AiOutlineInstagram className="icon" />
            <div className="name">instagram</div>
            <FiArrowUpRight className="go" aria-hidden />
          </a>
        )}
        {CONFIG.profile.email && (
          <a
            href={`mailto:${CONFIG.profile.email}`}
            rel="noreferrer"
            target="_blank"
            css={{ overflow: "hidden" }}
          >
            <AiOutlineMail className="icon" />
            <div className="name">email</div>
            <FiArrowUpRight className="go" aria-hidden />
          </a>
        )}
        {CONFIG.profile.linkedin && (
          <a
            href={`https://www.linkedin.com/in/${CONFIG.profile.linkedin}`}
            rel="noreferrer"
            target="_blank"
          >
            <AiFillLinkedin className="icon" />
            <div className="name">linkedin</div>
            <FiArrowUpRight className="go" aria-hidden />
          </a>
        )}
      </StyledWrapper>
    </>
  )
}

export default ContactCard

const StyledWrapper = styled.div`
  display: flex;
  padding: 0.375rem;
  margin-bottom: 2rem;
  flex-direction: column;
  gap: 0.125rem;
  border-radius: 1.5rem;
  ${({ theme }) => theme.surfaces.glass}
  a {
    display: flex;
    padding: 0.5rem;
    gap: 0.75rem;
    align-items: center;
    border-radius: 1.125rem;
    color: ${({ theme }) => theme.colors.gray12};
    cursor: pointer;
    transition: background-color 150ms ${({ theme }) => theme.variables.easing};

    :hover {
      color: ${({ theme }) => theme.colors.gray12};
      ${({ theme }) => theme.surfaces.hover}
    }
    :focus-visible {
      outline: 2px solid ${({ theme }) => theme.surfaces.focusRing};
    }
    .icon {
      display: block;
      flex: 0 0 2rem;
      width: 2rem;
      height: 2rem;
      padding: 0.4375rem;
      border-radius: 0.75rem;
      color: ${({ theme }) => theme.colors.gray11};
      ${({ theme }) => theme.surfaces.claySoft}
    }
    .name {
      flex: 1;
      min-width: 0;
      font-size: 0.875rem;
      line-height: 1.25rem;
    }
    .go {
      flex: 0 0 auto;
      width: 1rem;
      height: 1rem;
      color: ${({ theme }) => theme.colors.gray10};
    }
  }
`
