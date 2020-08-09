import React, { ReactNode } from 'react';
import styled from 'styled-components';

interface IProps {
    full?: boolean;
    title?: string;
    children: ReactNode;
}

// Standard Section

const SectionContainer = styled.section`
  margin: 16px 0;
  padding: ${props => props.full
    ? '0'
    : '0 16px'};
`;

export const SectionTitle = styled.h3`
  text-align: left;
  font-size: 15px;
  padding: ${props => props.full
    ? '6px 16px'
    : '6px 0'};
  color: #27173E;
  font-weight: 500;
  margin: 0;
`;

export const Section = ({full, title, children}: IProps) => {
    return (
        <SectionContainer full={full}>
            <SectionTitle full={full}>{title}</SectionTitle>
            {children}
        </SectionContainer>
    );
};
