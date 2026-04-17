"use client";
import { Input } from "@/components/ui";
import React, { useState } from "react";

export default function DoctorRegisterPage() {
  return (
    <div>
      <h1>Doctor Registration</h1>
      {/* Registration form goes here */}
      <form>
        <Input type="text" id="name" name="name" placeholder="Name" required />
        <Input
          type="email"
          id="email"
          name="email"
          placeholder="Email"
          required
        />
        <Input
          type="password"
          id="password"
          name="password"
          placeholder="Password"
          required
        />
        <button type="submit">Register</button>
      </form>
    </div>
  );
}
