import { inject, observer } from "mobx-react";
import React, { FC } from "react";
import { Link } from "react-router-dom";
import { Button, Container, Header, Modal } from "semantic-ui-react";

import { StudyActions } from "../../Store/StudyStore/StudyProvenance";
import StudyStore from "../../Store/StudyStore/StudyStore";

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
        Capturing User’s Intent when Brushing in Data Visualizations.
      </Header>
      <p>
        You will complete a high-level task on an interactive scatterplot. As
        you complete the given task, the system suggests a list of intents, and
        you will select the intent that closely matches what you were trying to
        do. The goal is to measure how well the predicted intents match your
        own.
      </p>
      <p>
        You will see a training video which walks you through the system and how
        to use it to complete the tasks. You will go through 2 phases in the
        study. The phases are auto-complete supported selections and manual
        selections tasks for identifying patterns. The order is randomized. Each
        phase is preceded by training tasks. After all the tasks are completed,
        you will fill up a feedback form.
      </p>
      <p>
        The potential risks to participants are minimal. There may be minor risk
        of discomfort.
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
        It should take 15 minutes to complete the study. Participation in this
        study is voluntary. You can choose not to take part in all or any part
        of the study. You can choose not to finish the study or omit any
        question you prefer not to answer without penalty or loss of benefits.
      </p>
      <p>
        By completing the study tasks, you are giving your consent to
        participate. We appreciate your participation.
      </p>
      <Modal trigger={<Button content="I Consent" positive />}>
        <Modal.Header>Conditions for Participation and Payment</Modal.Header>
        <Modal.Content>
          <p>We estimate that this study will take about 15 minutes.</p>
          <p>
            A desktop or notebook computer with a mouse or a touch-pad is
            required to participate. You cannot participate on a mobile device
            of any kind.
          </p>
          <p>
            The study consists of watching an 5 minute instructional video, a
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
