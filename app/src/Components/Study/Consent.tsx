import { inject, observer } from 'mobx-react';
import React, { FC } from 'react';
import { Link, useRouteMatch } from 'react-router-dom';
import { Button, Container, Header, Modal } from 'semantic-ui-react';

import { StudyActions } from '../../Store/StudyStore/StudyProvenance';
import StudyStore from '../../Store/StudyStore/StudyStore';

type Props = {
  studyStore?: StudyStore;
  actions: StudyActions;
};

const Consent: FC<Props> = ({ studyStore, actions }: Props) => {
  const { path, url } = useRouteMatch();

  return (
    <Container>
      <Header textAlign="center" as="h1">
        Consent
      </Header>
      <Header>
        Enabling Reproducibility of Interactive Visual Data Analysis
      </Header>
      <p>
        The purpose of this research study is to learn about preferences for
        data analysis using user-driven selections and computer supported
        selections.
      </p>
      {/* <p>
        This study will consist of you using a visualization tool and completing
        the tasks.
      </p> */}
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
        reached by phone at +1 (801) 581-3655 or by e-mail at{" "}
        <a href="mailto:irb@hsc.utah.edu">irb@hsc.utah.edu</a>.
      </p>
      <p>
        It should take 20 minutes to one hour to complete the study.
        Participation in this study is voluntary. You can choose not to take
        part in all or any part of the study. You can choose not to finish the
        study or omit any question you prefer not to answer without penalty or
        loss of benefits.
      </p>
      <p>
        By returning this questionnaire, you are giving your consent to
        participate. We appreciate your participation.
      </p>
      <Modal trigger={<Button content="I Consent" positive />}>
        <Modal.Header>Conditions for Participation and Payment</Modal.Header>
        <Modal.Content>
          <p>We estimate that this study will take about 30 minutes.</p>
          <p>
            A desktop or notebook computer with a mouse or a touch-pad is
            required to participate. You cannot participate on a mobile device
            of any kind.
          </p>
          <p>
            The study consists of watching an 8 minute instructional video, a
            short training period, and the study in two conditions, followed by
            a one-page survey.
          </p>
          <p>
            Your payment is conditional on you fully and attentively watching
            the video, passing a set of trial tasks, and making an honest effort
            to complete the study.
          </p>
          <p>Thank you for your participation!</p>
        </Modal.Content>
        <Modal.Actions>
          <Link to={`/video`}>
            <Button
              content="Proceed to study"
              positive
              onClick={() => {
                actions.nextPhase("Video");
              }}
            />
          </Link>
        </Modal.Actions>
      </Modal>
    </Container>
  );
};

export default inject("studyStore")(observer(Consent));
