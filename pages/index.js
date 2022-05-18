import { useState, useEffect } from "react";
import {
  ListGroup,
  Button,
  Spinner,
  Toast,
  Modal,
  Form,
  Col,
} from "react-bootstrap";
import cronstrue from "cronstrue";
import { useForm, Controller } from "react-hook-form";
import Select from "react-select";

import Layout from "../components/Layout";

const hourOptions = [
  { value: "1", label: "1" },
  { value: "2", label: "2" },
  { value: "3", label: "3" },
  { value: "4", label: "4" },
  { value: "5", label: "5" },
  { value: "6", label: "6" },
  { value: "7", label: "7" },
  { value: "8", label: "8" },
  { value: "9", label: "9" },
  { value: "10", label: "10" },
  { value: "11", label: "11" },
  { value: "12", label: "12" },
];

const minuteOptions = [
  { value: "0", label: "00" },
  { value: "15", label: "15" },
  { value: "30", label: "30" },
  { value: "45", label: "45" },
];

const amPmOptions = [
  { value: "0", label: "AM" },
  { value: "12", label: "PM" },
];

const weekdayOptions = [
  { value: "1", label: "Monday" },
  { value: "2", label: "Tuesday" },
  { value: "3", label: "Wednesday" },
  { value: "4", label: "Thursday" },
  { value: "5", label: "Friday" },
  { value: "6", label: "Saturday" },
  { value: "0", label: "Sunday" },
];

const defaultValues = {
  name: "",
  weekday: [weekdayOptions[6], weekdayOptions[0]],
  hour: [hourOptions[8]],
  minute: [minuteOptions[2]],
  amPm: [amPmOptions[1]],
};

export default function Home() {
  const [items, setItems] = useState();
  const [message, setMessage] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const {
    handleSubmit,
    control,
    watch,
    setError,
    errors,
    formState: { isSubmitting, touched },
  } = useForm({
    defaultValues,
  });

  useEffect(() => {
    // deleteSchedule("2b40b7f0-b84a-420e-bef8-5f6b62097a3e");
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/schedule`)
      .then((res) => res.json())
      .then((response) => {
        setItems(response?.items);
      });
  }, []);

  function handleCloseModal() {
    setShowModal(false);
  }
  function handleShowModal() {
    setShowModal(true);
  }

  function onSubmit(formData) {
    const watchName = watch("name");
    const watchWeekday = watch("weekday");
    let hasErrors = false;

    if (!watchName?.length) {
      setError("name", {
        type: "manual",
        message: "You have to enter a name right meow!",
      });
      hasErrors = true;
    }

    if (!watchWeekday?.length) {
      setError("weekday", {
        type: "manual",
        message: "Select at least one day right meow!",
      });
      hasErrors = true;
    }

    if (hasErrors) return;

    const { name, minute, hour, amPm, weekday } = formData;

    const minuteValue = minute?.[0]?.value || minute?.value;
    const hourValue =
      parseInt(hour?.[0]?.value || hour?.value) +
      parseInt(amPm?.[0]?.value || amPm?.value);
    const weekdays = weekday.reduce((a, c) => {
      a.push(c.value);
      return a;
    }, []);

    const weekdayValue = weekdays?.length ? weekdays : "*";

    const data = {
      name,
      // Cron format.
      schedule: `${minuteValue} ${hourValue} * * ${weekdayValue}`,
    };

    fetch(`${process.env.NEXT_PUBLIC_API_URL}/add`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ...data }),
    })
      .then((res) => res.json())
      .then((response) => {
        setItems(response?.items);
        handleCloseModal();
        setMessage(`Successfully add ${data.name}`);
      });
  }

  function deleteSchedule(id) {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/delete`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id }),
    })
      .then((res) => res.json())
      .then((response) => {
        setItems(response?.items);
      });
  }

  // NOTE: For use only when hooked up to hardware.
  // function feed() {
  //   fetch(`${process.env.NEXT_PUBLIC_API_URL}/feed`)
  //     .then((res) => res.json())
  //     .then((response) => {
  //       setMessage(response?.message);
  //     });
  // }

  return (
    <Layout title="Homepage">
      {!items?.length ? <hr className="mt-0" /> : null}

      <Toast
        onClose={() => setMessage(null)}
        show={!!message}
        delay={3000}
        autohide
        className="bg-success mx-auto"
      >
        <Toast.Header>
          <strong className="mr-auto text-success">{message}</strong>
        </Toast.Header>
      </Toast>

      {!items ? (
        <div className="spinner-wrapper">
          <Spinner animation="border" role="status">
            <span className="sr-only">Loading...</span>
          </Spinner>
        </div>
      ) : items?.length ? (
        <ListGroup className="my-4">
          {items.map(function (item) {
            return (
              <ListGroup.Item key={item.id}>
                <h2 className="h4 mb-1">{item.name}</h2>
                <small>{cronstrue.toString(item.schedule)}</small>
                <div className="action-buttons">
                  {/* <Button variant="secondary" size="sm">
                    Edit
                  </Button> */}
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => deleteSchedule(item.id)}
                  >
                    Delete
                  </Button>
                </div>
              </ListGroup.Item>
            );
          })}
        </ListGroup>
      ) : (
        <p className="text-center">
          No schedule yet... You should make one! I'm hungry 😿
        </p>
      )}

      <div className="text-center">
        <Button variant="secondary" size="lg" onClick={handleShowModal}>
          Add Schedule
        </Button>
        {/* NOTE: For use only when hooked up to hardware. */}
        {/* <Button variant="primary" size="lg" onClick={feed}>
          Feed Right Meow!
        </Button> */}
      </div>

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Add Schedule</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <Modal.Body>
            <Form.Group controlId="scheduleForm.name">
              <Form.Label>Name</Form.Label>
              <Controller
                as={<Form.Control type="text" />}
                control={control}
                name="name"
              />
              {errors?.name && touched?.name && (
                <Form.Text className="text-danger">
                  {errors.name?.message}
                </Form.Text>
              )}
            </Form.Group>

            <Form.Group controlId="scheduleForm.weekday">
              <Form.Label>Days of the week</Form.Label>
              <Controller
                as={
                  <Select
                    options={weekdayOptions}
                    isMulti
                    closeMenuOnSelect={false}
                  />
                }
                control={control}
                name="weekday"
              />
              {errors?.weekday && touched?.weekday && (
                <Form.Text className="text-danger">
                  {errors.weekday?.message}
                </Form.Text>
              )}
            </Form.Group>

            <Form.Row>
              <Form.Group as={Col} controlId="scheduleForm.hour">
                <Form.Label>Hour</Form.Label>
                <Controller
                  as={<Select options={hourOptions} />}
                  control={control}
                  name="hour"
                />
              </Form.Group>

              <Form.Group as={Col} controlId="scheduleForm.minute">
                <Form.Label>Minute</Form.Label>
                <Controller
                  as={<Select options={minuteOptions} />}
                  control={control}
                  name="minute"
                />
              </Form.Group>

              <Form.Group as={Col} controlId="scheduleForm.amPm">
                <Form.Label>AM/PM</Form.Label>
                <Controller
                  as={<Select options={amPmOptions} />}
                  control={control}
                  name="amPm"
                />
              </Form.Group>
            </Form.Row>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="text" onClick={handleCloseModal}>
              Close
            </Button>
            <Button
              type="submit"
              variant="secondary"
              disabled={Object.keys(errors ?? {})?.length || isSubmitting}
            >
              Save Changes
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </Layout>
  );
}
