import { inject, observer } from 'mobx-react';
import React, { FC } from 'react';
import { Button, Container, Header } from 'semantic-ui-react';

import { StudyActions } from '../../Store/StudyStore/StudyProvenance';
import StudyStore from '../../Store/StudyStore/StudyStore';

type Props = {
  studyStore?: StudyStore;
  actions: StudyActions;
};

const Consent: FC<Props> = ({ studyStore, actions }: Props) => {
  return (
    <Container>
      <Header textAlign="center" as="h1">
        Consent
      </Header>
      <Header>
        Enabling Reproducibility of Interactive Visual Data Analysis: Annotation
        and Documentation Preferences; Pattern Classification
      </Header>
      <p>
        The purpose of this research study is to learn about your workflow for
        data analysis, and specifically how you annotate and document your
        findings. We also want to study which kind of patterns are “of interest”
        to you when using a visual data analysis tool. We are doing this study
        because we want to understand your practices in saving, annotating and
        communicating findings, and we want to characterize types and classes of
        patterns seen in data.
      </p>
      <p>
        This study will consist of three parts: (1) an interview, (2) you
        sharing documentation of your (non-sensitive) research findings for us
        to analyze, (3) you using a visualization tool and ‘’thinking aloud”
        while conducting an analysis, i.e., comment on what you are doing and
        thinking.
      </p>
      <p>
        The potential risks to participants are minimal. There may be minor risk
        of discomfort for participants as they are observed and surveyed. There
        is a potential for psychological harm (e.g., embarrassment) from being
        observed and surveyed.
      </p>
      <p>
        We will not disclose your identity and use only anonymized data in the
        analysis.
      </p>
      <p>
        If you have any questions complaints or if you feel you have been harmed
        by this research please contact{" "}
        <em>
          Alexander Lex, School of Computing, University of Utah, 72 South
          Central Campus Drive, Room 3887 or by phone at +1 801 585 6513.
        </em>
      </p>
      <p>
        Contact the Institutional Review Board (IRB) if you have questions
        regarding your rights as a research participant. Also, contact the IRB
        if you have questions, complaints or concerns which you do not feel you
        can discuss with the investigator. The University of Utah IRB may be
        reached by phone at +1 (801) 581-3655 or by e-mail at
        <a href="mailto:irb@hsc.utah.edu">irb@hsc.utah.edu</a>.
      </p>
      <p>
        It should take two hours to complete the study. Participation in this
        study is voluntary. You can choose not to take part in all or any part
        of the study. You can choose not to finish the study or omit any
        question you prefer not to answer without penalty or loss of benefits.
      </p>
      <p>
        By returning this questionnaire, you are giving your consent to
        participate. We appreciate your participation.
      </p>
      <Button
        content="I consent"
        positive
        onClick={() => actions.nextPhase("Video")}
      />
    </Container>
  );
};

export default inject("studyStore")(observer(Consent));
