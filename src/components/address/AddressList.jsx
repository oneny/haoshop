import React, { useState } from "react";
import { useSelector } from "react-redux";
import AddressForm from "./AddressForm";

function AddressList({ setConfirmedAddress }) {
  const { addresses } = useSelector((store) => store.user);

  const [selectedAddress, setSelectedAddress] = useState("");
  const [isFormOpened, setIsFormOpened] = useState(false);
  const [formType, setFormType] = useState("add");

  return (
    <div className="addressList">
      <div className="addressList-wrapper">
        <div>
          {addresses?.map((address) => (
            <div className="addressList-items" key={address._id}>
              <input
                name="address"
                type="radio"
                onClick={() => setSelectedAddress(address)}
              />
              <div className="address-info">
                <span>{address.name}</span>
                <span>{address.contactNumber}</span>
                <span>{address.pinCode}</span>
                <span>
                  ({address.address1}) {address.address2}
                </span>
                <span>{address.claim}</span>
              </div>
            </div>
          ))}
        </div>
        <div className="addressList-btn">
          {selectedAddress && (
            <>
              <button onClick={() => setConfirmedAddress(selectedAddress)}>
                배송지 설정
              </button>
              <button
                onClick={() => {
                  setIsFormOpened(isFormOpened ? false : true);
                  setFormType("update");
                }}
              >
                배송지 수정
              </button>
            </>
          )}
          <button
            onClick={() => {
              setIsFormOpened(isFormOpened ? false : true);
              setFormType("add");
            }}
          >
            배송지 추가
          </button>
        </div>
        {isFormOpened && (formType === "add" ? (
          <AddressForm />
        ) : (
          <AddressForm selectedAddress={selectedAddress} />
        ))}
      </div>
    </div>
  );
}

export default AddressList;