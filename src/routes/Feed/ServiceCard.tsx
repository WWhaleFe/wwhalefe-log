import { CONFIG } from "site.config"
import React from "react"
import { AiFillCodeSandboxCircle } from "react-icons/ai"
import styled from "@emotion/styled"
import { FiArrowUpRight } from "react-icons/fi"
import SectionTitle from "src/components/SectionTitle"

const ServiceCard: React.FC = () => {
  if (!CONFIG.projects) return null
  return (
    <>
      <SectionTitle>Service</SectionTitle>
      <StyledWrapper>
        {CONFIG.projects.map((project, idx) => (
          <a
            key={idx}
            href={`${project.href}`}
            rel="noreferrer"
            target="_blank"
          >
            <AiFillCodeSandboxCircle className="icon" />
            <div className="name">{project.name}</div>
            <FiArrowUpRight className="go" aria-hidden />
          </a>
        ))}
      </StyledWrapper>
    </>
  )
}

export default ServiceCard

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
