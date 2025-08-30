import React from 'react'

const UsageExample = () => {
  return (
    <div>
        <ModalWrapper open={modalOpen} setOpen={setModalOpen} title="Create User">
        <Form onSubmit={handleSubmit(onSubmit)}>
            <Textbox name="name" label="Full Name" register={register} error={errors.name} required />
            <Textbox name="email" label="Email" register={register} error={errors.email} required />
            <Textbox name="role" label="Role" register={register} error={errors.role} />
            <Button label="Save" isLoading={loading} />
        </Form>
        </ModalWrapper>

    </div>
  )
}

export default UsageExample