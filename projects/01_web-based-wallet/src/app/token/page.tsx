"use client"

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import bs58 from "bs58";
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle2, XCircle, Loader2 } from 'lucide-react';
import axios from 'axios';
import { Keypair } from '@solana/web3.js';

export default function TokenCreator() {
  const [feePayerSecret, setFeePayerSecret] = useState('');
  const [freezeAuthorityPublicKey, setFreezeAuthorityPublicKey] = useState('');
  const [response, setResponse] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [balance, setBalance] = useState<number | null>(null);
  const [checkingBalance, setCheckingBalance] = useState(false);

  const handleCreateToken = async () => {
    setError('');
    setSuccess('');
    setResponse('');

    if (!feePayerSecret.trim() || !freezeAuthorityPublicKey.trim()) {
      setError('Both fields are required');
      return;
    }

    if (balance === 0) {
      setError('Insufficient balance. Please add SOL first.');
      return;
    }

    setLoading(true);

    try {
      const secretBytes = Array.from(bs58.decode(feePayerSecret));

      const res = await axios.post("http://localhost:3000/api/createToken", {
        feePayerSecret: secretBytes,
        freezeAuthorityPublicKey
      });

      if (res.status === 200) {
        setSuccess('Token created successfully!');
        setResponse(JSON.stringify(res.data.mint, null, 2));
      } else {
        setError('Failed to create token');
        setResponse(JSON.stringify(res.data.mint, null, 2));
      }
    } catch (err) {
      setError('Network error: Unable to connect to the server');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const checkBalance = async () => {
    if (!feePayerSecret.trim()) return;
    setCheckingBalance(true);
    try {
      const secretBytes = Array.from(bs58.decode(feePayerSecret));
      const keypair = Keypair.fromSecretKey(Uint8Array.from(secretBytes));
      const res = await axios.post("http://localhost:3000/api/getBalance", {
        type: "Solana",
        secretKey: keypair.publicKey
      });

      /*

      */ 

      setBalance(res.data.data || 0);
    } catch (err) {
      console.error(err);
      alert("Error fetching balance");
    } finally {
      setCheckingBalance(false);
    }
  };

  const addBalance = async () => {
    if (!feePayerSecret.trim()) return;
    setCheckingBalance(true);
    try {
      const secretBytes = Array.from(bs58.decode(feePayerSecret));
      const res = await axios.post("http://localhost:3000/api/addBalance", {
        type: "Solana",
        secretKey: secretBytes
      });
      setBalance(res.data.data || 0);
      alert("Balance updated successfully!");
    } catch (err) {
      console.error(err);
      alert("Error adding balance");
    } finally {
      setCheckingBalance(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle className="text-3xl">Token Creator</CardTitle>
          <CardDescription>Create your blockchain token with ease</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="feePayerSecret">
              Fee Payer Secret <span className="text-red-500">*</span>
            </Label>
            <Input
              id="feePayerSecret"
              type="text"
              value={feePayerSecret}
              onChange={(e) => setFeePayerSecret(e.target.value)}
              onBlur={checkBalance}
              placeholder="Enter fee payer secret"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="freezeAuthorityPublicKey">
              Freeze Authority Public Key <span className="text-red-500">*</span>
            </Label>
            <Input
              id="freezeAuthorityPublicKey"
              type="text"
              value={freezeAuthorityPublicKey}
              onChange={(e) => setFreezeAuthorityPublicKey(e.target.value)}
              placeholder="Enter freeze authority public key"
              required
            />
          </div>

          <div className="space-y-2">
            <Input
              type="text"
              value={
                checkingBalance
                  ? "Checking..."
                  : balance !== null
                  ? balance
                  : "NaN"
              }
              readOnly
            />
            {balance === 0 && !checkingBalance && (
              <Button onClick={addBalance} className="w-full bg-yellow-500">
                Add Balance
              </Button>
            )}
          </div>

          <Button
            onClick={handleCreateToken}
            disabled={loading || balance === 0 || checkingBalance}
            className="w-full"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating Token...
              </>
            ) : (
              'Create Token'
            )}
          </Button>

          {success && (
            <Alert className="border-green-200 bg-green-50">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800 ml-2">
                {success}
              </AlertDescription>
            </Alert>
          )}

          {error && (
            <Alert className="border-red-200 bg-red-50">
              <XCircle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-800 ml-2">
                {error}
              </AlertDescription>
            </Alert>
          )}

          {response && (
            <div className="space-y-2">
              <Label htmlFor="response">API Response</Label>
              <Textarea
                id="response"
                value={response}
                readOnly
                rows={8}
                className="font-mono text-sm"
              />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
