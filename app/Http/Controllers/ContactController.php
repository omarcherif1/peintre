<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;

class ContactController extends Controller
{
    public function envoyer(Request $request)
    {
        $data = $request->validate([
            'nom'      => 'required|string|max:255',
            'email'    => 'required|email|max:255',
            'telephone'=> 'required|digits:8',
            'sujet'    => 'required|string|max:255',
            'message'  => 'required|string|max:5000',
        ]);

        Mail::send([], [], function ($mail) use ($data) {
            $mail->to(config('mail.contact_email', 'contact@chokribenomrane.com'))
                ->replyTo($data['email'], $data['nom'])
                ->subject('[Site] ' . $data['sujet'])
                ->html(
                    '<p><strong>De :</strong> ' . e($data['nom']) . ' (' . e($data['email']) . ')</p>' .
                    '<p><strong>Téléphone :</strong> ' . e($data['telephone']) . '</p>' .
                    '<p><strong>Sujet :</strong> ' . e($data['sujet']) . '</p>' .
                    '<hr>' .
                    '<p>' . nl2br(e($data['message'])) . '</p>'
                );
        });

        return back()->with('success', 'Votre message a bien été envoyé. Réponse sous 48h.');
    }
}
